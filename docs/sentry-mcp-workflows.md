# Sentry MCP Workflow Examples

This document provides practical examples of using the Sentry MCP server for error analysis, debugging, and monitoring in the design system lab.

## Prerequisites

- Sentry MCP server configured (see SENTRY_MCP_SETUP.md)
- MCP-compatible AI assistant (Claude, etc.)
- Active Sentry project with some error data

## Workflow 1: Daily Error Triage

### Objective
Review and prioritize new errors from the previous day.

### Steps

1. **List recent issues:**
```
List all issues from the design-system project created in the last 24 hours,
sorted by event count.
```

2. **Analyze high-frequency errors:**
```
Get details for issue [ID] including stack trace, affected users, and frequency.
```

3. **Get AI-powered fix suggestions:**
```
Analyze this Sentry issue and suggest potential fixes based on the stack trace
and error context.
```

4. **Prioritize based on impact:**
```
Show me all critical errors affecting the Button component,
sorted by user impact.
```

### Expected Outcome
- List of prioritized errors
- Initial diagnosis for each high-priority issue
- Suggested fixes for common patterns

## Workflow 2: Component Performance Analysis

### Objective
Identify performance issues in specific design system components.

### Steps

1. **Query component-specific errors:**
```
Find all errors tagged with "component:Button" in the last 7 days.
```

2. **Analyze error patterns:**
```
Group these errors by error type and show me the most common patterns.
```

3. **Check for regression:**
```
Compare error rates for the Button component between the current week
and the previous week.
```

4. **Review session replays:**
```
Get session replays for the top 3 Button-related errors.
```

### Expected Outcome
- Performance bottlenecks identified
- Common error patterns documented
- Visual evidence via session replays

## Workflow 3: Release Monitoring

### Objective
Monitor errors after deploying new components or updates.

### Steps

1. **Set up pre-release baseline:**
```
Show me the current error rate for [component] over the last 24 hours.
```

2. **Post-release monitoring:**
```
After deployment:
List all new issues introduced in the last 2 hours tagged with
release:[version].
```

3. **Compare error rates:**
```
Compare the error rate for [component] before and after the release.
```

4. **Quick rollback decision:**
```
If error rate increased by >50%:
Show me stack traces for the new errors to determine if rollback is needed.
```

### Expected Outcome
- Early detection of release issues
- Data-driven rollback decisions
- Faster incident response

## Workflow 4: Cross-Component Error Investigation

### Objective
Identify errors that span multiple components, indicating systemic issues.

### Steps

1. **Search for common error messages:**
```
Find all issues containing "undefined is not a function" across all components
in the last week.
```

2. **Identify affected components:**
```
Group these errors by component tag and show distribution.
```

3. **Find common dependencies:**
```
Analyze the stack traces to identify shared dependencies or utilities
causing the errors.
```

4. **Propose systematic fix:**
```
Based on these patterns, suggest a fix that addresses the root cause
across all components.
```

### Expected Outcome
- Root cause analysis
- Systematic fix rather than patching symptoms
- Prevention of future similar errors

## Workflow 5: User-Reported Bug Investigation

### Objective
Investigate a specific bug reported by a user.

### Steps

1. **Find the specific error:**
```
Find Sentry issues matching:
- User email: user@example.com
- Timeframe: [reported time] ± 1 hour
- Component: [affected component]
```

2. **Get full context:**
```
For issue [ID], show me:
- Full stack trace
- User's browser and OS
- Session replay if available
- Related errors in the same session
```

3. **Reproduce locally:**
```
Based on the error context, what are the exact steps to reproduce this error?
```

4. **Verify fix:**
```
After deploying fix:
Check if user [email] has encountered this error again in the last 24 hours.
```

### Expected Outcome
- Complete understanding of user's issue
- Reproduction steps for local testing
- Verification that fix resolves the problem

## Workflow 6: Performance Regression Detection

### Objective
Detect and diagnose performance degradation in components.

### Steps

1. **Establish performance baseline:**
```
What's the average load time for the Dashboard component over the last 30 days?
```

2. **Detect anomalies:**
```
Show me any days where Dashboard load time was >2 standard deviations
from the mean.
```

3. **Correlate with releases:**
```
For each anomaly date, show me what releases were deployed within
24 hours prior.
```

4. **Deep dive into slow transactions:**
```
For [anomaly date], show me the slowest 10 transactions for the Dashboard
component with their traces.
```

### Expected Outcome
- Performance regression identification
- Correlation with code changes
- Specific transactions to optimize

## Workflow 7: Security Error Monitoring

### Objective
Monitor for security-related errors and potential vulnerabilities.

### Steps

1. **Search for security-related errors:**
```
Find all errors containing keywords: "CORS", "CSP", "authentication",
"authorization", or "XSS" in the last 7 days.
```

2. **Analyze patterns:**
```
Group these by error message and show me the most frequent security issues.
```

3. **Check for exploitation attempts:**
```
For each security error, show me if there are spikes in frequency
that might indicate attempted exploitation.
```

4. **Generate security report:**
```
Create a summary of all security-related issues including:
- Severity
- Affected endpoints/components
- Recommended mitigations
```

### Expected Outcome
- Security vulnerability awareness
- Prioritized remediation list
- Evidence for security audits

## Best Practices

### Query Optimization
- Be specific with time ranges to reduce data volume
- Use component tags for focused analysis
- Filter by environment (production, staging, etc.)

### Error Context
- Always request full stack traces for debugging
- Include breadcrumbs for user action context
- Check for session replays when available

### Iteration
- Start broad, then narrow down
- Follow error trails to root causes
- Document findings for future reference

### Automation Opportunities
- Set up scheduled queries for common workflows
- Create alerts for specific error patterns
- Integrate with CI/CD for release monitoring

## Troubleshooting Workflows

### No Results Returned
1. Verify project slug and organization
2. Check time range (expand if needed)
3. Confirm you have the right permissions

### Too Many Results
1. Add more specific filters (component, error type)
2. Narrow time range
3. Use pagination for large result sets

### Missing Context
1. Ensure source maps are uploaded
2. Check that error boundaries are properly configured
3. Verify SDK is initialized correctly

## Additional Resources

- [Sentry Query Syntax](https://docs.sentry.io/product/sentry-basics/search/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
