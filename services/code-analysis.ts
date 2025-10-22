import { generateObject, generateText } from "@rork/toolkit-sdk";
import { z } from "zod";

export type CodeIssue = {
  file: string;
  line: number;
  type: "security" | "performance" | "quality";
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  description: string;
  suggestion: string;
  fixedCode?: string;
  impact?: string;
};

const CodeIssueSchema = z.object({
  file: z.string().describe("File path where the issue was found"),
  line: z.number().describe("Line number of the issue"),
  type: z.enum(["security", "performance", "quality"]).describe("Category of the issue"),
  severity: z.enum(["critical", "high", "medium", "low"]).describe("Severity level"),
  issue: z.string().describe("Brief title of the issue"),
  description: z.string().describe("Detailed description of what's wrong"),
  suggestion: z.string().describe("How to fix the issue"),
  fixedCode: z.string().optional().describe("Example of corrected code"),
  impact: z.string().optional().describe("Impact of the issue or fix"),
});

const AnalysisResultSchema = z.object({
  issues: z.array(CodeIssueSchema).describe("List of issues found in the code"),
  summary: z.string().describe("Overall summary of the analysis"),
  overallHealth: z.number().min(0).max(100).describe("Health score 0-100"),
});

export async function analyzeCodeSnippet(
  code: string,
  fileName: string,
  language: string
): Promise<{ issues: CodeIssue[]; summary: string; overallHealth: number }> {
  console.log(`[AI Analysis] Starting analysis for ${fileName} (${language})`);
  
  try {
    const result = await generateObject({
      messages: [
        {
          role: "user",
          content: `You are an expert code security and quality analyzer. Analyze this ${language} code from ${fileName} and identify:

1. SECURITY vulnerabilities (SQL injection, XSS, authentication issues, etc.)
2. PERFORMANCE problems (memory leaks, inefficient algorithms, N+1 queries, etc.)
3. CODE QUALITY issues (unused variables, dead code, bad practices, etc.)

For each issue found:
- Specify the exact line number
- Rate severity: critical (security breaches), high (major bugs), medium (should fix), low (nice to have)
- Provide a clear fix with code example
- Explain the impact

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Be thorough but realistic. Real code always has some issues. Provide 3-7 actionable issues if any exist.`,
        },
      ],
      schema: AnalysisResultSchema,
    });

    console.log(`[AI Analysis] Found ${result.issues.length} issues in ${fileName}`);
    return result;
  } catch (error) {
    console.error("[AI Analysis] Error:", error);
    throw new Error("AI analysis failed. Please try again.");
  }
}

export async function analyzeRepository(
  repoName: string,
  codeFiles: { path: string; content: string; language: string }[]
): Promise<{ issues: CodeIssue[]; summary: string; overallHealth: number }> {
  console.log(`[AI Analysis] Starting repository analysis for ${repoName}`);
  console.log(`[AI Analysis] Analyzing ${codeFiles.length} files`);

  const allIssues: CodeIssue[] = [];
  
  for (const file of codeFiles) {
    try {
      const fileAnalysis = await analyzeCodeSnippet(
        file.content,
        file.path,
        file.language
      );
      
      allIssues.push(...fileAnalysis.issues);
    } catch (error) {
      console.error(`[AI Analysis] Failed to analyze ${file.path}:`, error);
    }
  }

  const criticalCount = allIssues.filter(i => i.severity === "critical").length;
  const highCount = allIssues.filter(i => i.severity === "high").length;
  const mediumCount = allIssues.filter(i => i.severity === "medium").length;
  const lowCount = allIssues.filter(i => i.severity === "low").length;

  const healthScore = Math.max(
    0,
    100 - (criticalCount * 15 + highCount * 8 + mediumCount * 3 + lowCount * 1)
  );

  const summary = `Repository analysis complete: Found ${allIssues.length} issues across ${codeFiles.length} files. ${criticalCount} critical, ${highCount} high, ${mediumCount} medium, ${lowCount} low severity.`;

  console.log(`[AI Analysis] ${summary}`);
  console.log(`[AI Analysis] Health score: ${healthScore}%`);

  return {
    issues: allIssues,
    summary,
    overallHealth: healthScore,
  };
}

export async function generateCodeFix(
  originalCode: string,
  issue: string,
  fileName: string,
  language: string
): Promise<string> {
  console.log(`[AI Fix] Generating fix for: ${issue}`);

  try {
    const fixedCode = await generateText({
      messages: [
        {
          role: "user",
          content: `You are an expert ${language} developer. Fix this code issue:

Issue: ${issue}
File: ${fileName}

Original code:
\`\`\`${language}
${originalCode}
\`\`\`

Provide ONLY the fixed code (no explanations). Show before and after with comments.`,
        },
      ],
    });

    console.log(`[AI Fix] Fix generated successfully`);
    return fixedCode;
  } catch (error) {
    console.error("[AI Fix] Error:", error);
    throw new Error("Failed to generate code fix");
  }
}

export async function quickAnalyze(codeSnippet: string): Promise<string> {
  console.log("[AI Quick Analyze] Analyzing code snippet");

  try {
    const analysis = await generateText({
      messages: [
        {
          role: "user",
          content: `Quickly analyze this code for critical issues:\n\n${codeSnippet}\n\nProvide a brief summary (2-3 sentences) of the main issues found.`,
        },
      ],
    });

    return analysis;
  } catch (error) {
    console.error("[AI Quick Analyze] Error:", error);
    return "Unable to analyze code at this time.";
  }
}
