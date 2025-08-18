import { eq, desc, count } from "drizzle-orm";
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
      
      let whereConditions = [];
      if (filters.status) whereConditions.push(eq(reports.status, filters.status));
      if (filters.priority) whereConditions.push(eq(reports.priority, filters.priority));
      if (filters.type) whereConditions.push(eq(reports.type, filters.type));

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
        .orderBy(desc(reports.createdAt))
        .limit(limit)
        .offset(offset);

      const [totalResult] = await db.select({ count: count() }).from(reports);

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
}
