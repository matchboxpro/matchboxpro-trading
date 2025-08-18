// Sistema di cattura automatica degli errori per MATCHBOX
interface ErrorReport {
  type: 'js_error' | 'network_error' | 'api_error';
  description: string;
  page?: string;
  errorDetails?: string;
  url?: string;
}

// Funzione per inviare segnalazioni automatiche
async function sendErrorReport(report: ErrorReport) {
  try {
    await fetch('/api/reports/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...report,
        page: window.location.pathname,
        url: window.location.href,
      }),
    });
  } catch (error) {
    // Silently fail to avoid recursive errors
    console.warn('Impossibile inviare la segnalazione di errore:', error);
  }
}

// Cattura errori JavaScript globali
export function setupErrorReporting() {
  // Cattura errori JavaScript non gestiti
  window.addEventListener('error', (event) => {
    const errorDetails = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pageContext: {
        title: document.title,
        pathname: window.location.pathname,
        referrer: document.referrer
      }
    };

    sendErrorReport({
      type: 'js_error',
      description: `JavaScript Error: ${event.message}`,
      errorDetails: JSON.stringify(errorDetails, null, 2),
    });
  });

  // Cattura promesse rifiutate non gestite
  window.addEventListener('unhandledrejection', (event) => {
    const errorDetails = {
      reason: String(event.reason),
      stack: event.reason?.stack || 'No stack trace',
      name: event.reason?.name || 'UnhandledPromiseRejection',
      message: event.reason?.message || String(event.reason),
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      pageContext: {
        title: document.title,
        pathname: window.location.pathname,
        referrer: document.referrer
      }
    };

    sendErrorReport({
      type: 'api_error',
      description: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      errorDetails: JSON.stringify(errorDetails, null, 2),
    });
  });

  // Intercepta fetch per catturare errori di rete
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Segnala errori HTTP (escludi /api/reports/error per evitare loop)
      if (!response.ok && response.status >= 500 && !response.url.includes('/api/reports/error')) {
        const errorDetails = {
          httpStatus: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString(),
          requestInfo: {
            method: args[1]?.method || 'GET',
            headers: args[1]?.headers || {},
            body: args[1]?.body ? String(args[1].body).substring(0, 1000) : null
          },
          userAgent: navigator.userAgent,
          pageContext: {
            title: document.title,
            pathname: window.location.pathname,
            referrer: document.referrer
          }
        };

        sendErrorReport({
          type: 'network_error',
          description: `HTTP ${response.status} Error: ${response.statusText}`,
          errorDetails: JSON.stringify(errorDetails, null, 2),
        });
      }
      
      return response;
    } catch (error) {
      // Segnala errori di rete (escludi /api/reports/error per evitare loop)
      const requestUrl = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : args[0]?.toString() || 'Unknown');
      
      if (!requestUrl.includes('/api/reports/error')) {
        const errorDetails = {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'NetworkError',
          timestamp: new Date().toISOString(),
          requestInfo: {
            url: requestUrl,
            method: args[1]?.method || 'GET',
            headers: args[1]?.headers || {},
            body: args[1]?.body ? String(args[1].body).substring(0, 1000) : null
          },
          networkContext: {
            onLine: navigator.onLine,
            connection: (navigator as any).connection ? {
              effectiveType: (navigator as any).connection.effectiveType,
              downlink: (navigator as any).connection.downlink,
              rtt: (navigator as any).connection.rtt
            } : 'Not available'
          },
          userAgent: navigator.userAgent,
          pageContext: {
            title: document.title,
            pathname: window.location.pathname,
            referrer: document.referrer
          }
        };

        sendErrorReport({
          type: 'network_error',
          description: `Network Error: ${error instanceof Error ? error.message : String(error)}`,
          errorDetails: JSON.stringify(errorDetails, null, 2),
        });
      }
      throw error;
    }
  };
}

// Funzione per segnalare errori manuali
export function reportError(description: string, details?: string, priority: 'alta' | 'media' | 'bassa' = 'media') {
  sendErrorReport({
    type: 'api_error',
    description,
    errorDetails: details,
  });
}

// Funzione per catturare errori specifici di React Query
export function setupReactQueryErrorReporting(queryClient: any) {
  queryClient.setDefaultOptions({
    queries: {
      onError: (error: Error) => {
        sendErrorReport({
          type: 'api_error',
          description: `Errore Query: ${error.message}`,
          errorDetails: error.stack,
        });
      },
    },
    mutations: {
      onError: (error: Error) => {
        sendErrorReport({
          type: 'api_error',
          description: `Errore Mutation: ${error.message}`,
          errorDetails: error.stack,
        });
      },
    },
  });
}