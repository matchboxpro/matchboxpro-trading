import { eq, desc, count, inArray, and } from "drizzle-orm";
import { reports, users, type Report, type InsertReport, type User } from "@shared/schema";
import { db } from "../database/connection";

export class ReportRepository {
  async getReports(): Promise<(Report & { reporter: User; reportedUser?: User })[]> {
    try {
      const result = await db
        .select({
          id: reports.id,
          reporterId: reports.reporterId,
          reportedUserId: reports.reportedUserId,
          type: reports.type,
          description: reports.description,
          status: reports.status,
          priority: reports.priority,
          page: reports.page,
          errorDetails: reports.errorDetails,
          userAgent: reports.userAgent,
          url: reports.url,
          createdAt: reports.createdAt,
          reporter: users,
        })
        .from(reports)
        .innerJoin(users, eq(reports.reporterId, users.id))
        .orderBy(desc(reports.createdAt));

      const enrichedReports = await Promise.all(
        result.map(async (report) => {
          if (report.reportedUserId) {
            const reportedUserResult = await db.select().from(users).where(eq(users.id, report.reportedUserId)).limit(1);
            const reportedUser = reportedUserResult[0];
            return { 
              ...report, 
              reportedUser: reportedUser || undefined,
              reporter: report.reporter || null
            };
          }
          return { 
            ...report, 
            reportedUser: undefined,
            reporter: report.reporter || null
          };
        })
      );

      return enrichedReports.filter(report => report.reporter !== null) as (Report & { reporter: User; reportedUser?: User })[];
    } catch (error) {
      console.error("Error fetching reports:", error);
      return [];
    }
  }

  async getReportsWithPagination(filters: {
    status?: string;
    priority?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: (Report & { reporter: User; reportedUser?: User })[];
    total: number;
    hasNextPage: boolean;
  }> {
    try {
      const limit = filters.limit || 20;
      const offset = ((filters.page || 1) - 1) * limit;
      
      let whereConditions: any[] = [];
      console.log('Building WHERE conditions with filters:', filters);
      if (filters.status) {
        console.log('Adding status filter:', filters.status);
        whereConditions.push(eq(reports.status, filters.status));
      }
      if (filters.priority) {
        console.log('Adding priority filter:', filters.priority);
        const priorities = filters.priority.split(',');
        if (priorities.length > 1) {
          whereConditions.push(inArray(reports.priority, priorities));
        } else {
          whereConditions.push(eq(reports.priority, filters.priority));
        }
      }
      if (filters.type) {
        console.log('Adding type filter:', filters.type);
        whereConditions.push(eq(reports.type, filters.type));
      }
      console.log('Total WHERE conditions:', whereConditions.length);

      const baseQuery = db
        .select({
          id: reports.id,
          reporterId: reports.reporterId,
          reportedUserId: reports.reportedUserId,
          type: reports.type,
          description: reports.description,
          status: reports.status,
          priority: reports.priority,
          page: reports.page,
          errorDetails: reports.errorDetails,
          userAgent: reports.userAgent,
          url: reports.url,
          createdAt: reports.createdAt,
          reporter: users,
        })
        .from(reports)
        .innerJoin(users, eq(reports.reporterId, users.id));

      const result = whereConditions.length > 0 
        ? await baseQuery
            .where(and(...whereConditions))
            .orderBy(desc(reports.createdAt))
            .limit(limit)
            .offset(offset)
        : await baseQuery
            .orderBy(desc(reports.createdAt))
            .limit(limit)
            .offset(offset);

      console.log('Query executed, result count:', result.length);
      if (result.length > 0) {
        console.log('First result status/priority/type:', {
          status: result[0].status,
          priority: result[0].priority,
          type: result[0].type
        });
      }

      // Count with same filters
      const [totalResult] = whereConditions.length > 0 
        ? await db.select({ count: count() }).from(reports).where(and(...whereConditions))
        : await db.select({ count: count() }).from(reports);

      const enrichedReports = await Promise.all(
        result.map(async (report) => {
          if (report.reportedUserId) {
            const reportedUserResult = await db.select().from(users).where(eq(users.id, report.reportedUserId)).limit(1);
            const reportedUser = reportedUserResult[0];
            return { 
              ...report, 
              reportedUser: reportedUser || undefined,
              reporter: report.reporter || null
            };
          }
          return { 
            ...report, 
            reportedUser: undefined,
            reporter: report.reporter || null
          };
        })
      );

      const validReports = enrichedReports.filter(report => report.reporter !== null) as (Report & { reporter: User; reportedUser?: User })[];

      return {
        reports: validReports,
        total: totalResult.count,
        hasNextPage: offset + limit < totalResult.count,
      };
    } catch (error) {
      console.error("Error fetching paginated reports:", error);
      return {
        reports: [],
        total: 0,
        hasNextPage: false,
      };
    }
  }

  async createReport(report: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(report).returning();
    return result[0];
  }

  async updateReport(id: string, updates: { status?: string; priority?: string }): Promise<Report> {
    const result = await db.update(reports)
      .set(updates)
      .where(eq(reports.id, id))
      .returning();
    return result[0];
  }

  async deleteReports(reportIds: string[]): Promise<void> {
    await db.delete(reports).where(inArray(reports.id, reportIds));
  }
}
