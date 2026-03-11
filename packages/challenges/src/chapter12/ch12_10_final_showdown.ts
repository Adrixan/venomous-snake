import type { Challenge } from '@venomous-snake/shared-types';

export const ch12_10_final_showdown: Challenge = {
  id: 'ch12_10_final_showdown',
  titleKey: 'challenges.ch12_10.title',
  descriptionKey: 'challenges.ch12_10.description',
  chapter: 12,
  order: 10,
  difficulty: 'expert',
  scaffoldingLevel: 'open',
  prerequisites: ['ch12_09_advanced_comprehensions'],
  xpReward: 350,
  tags: ['classes', 'string-parsing', 'filtering', 'sorting', 'boss'],
  scaffoldedCode:
    '# FINAL CHALLENGE: Combine ALL concepts\n# Parse vulnerability logs using string methods, classes, and filtering\n# Filter critical vulnerabilities and display sorted results\n',

  solutionCode:
    'class Vulnerability:\n    def __init__(self, id, severity, description):\n        self.id = id\n        self.severity = severity\n        self.description = description\n\ndef find_vulnerabilities(logs):\n    vulns = []\n    for log in logs:\n        if not log.startswith("VULN-"):\n            continue\n        # Parse "VULN-001[9]: Remote code execution..."\n        bracket = log.index("[")\n        close = log.index("]")\n        colon = log.index(": ")\n        vuln_id = log[0:bracket]\n        severity = int(log[bracket + 1:close])\n        desc = log[colon + 2:]\n        vulns.append(Vulnerability(vuln_id, severity, desc))\n    return vulns\n\nlogs = [\n    "VULN-001[9]: Remote code execution in auth module",\n    "INFO: System scan complete",\n    "VULN-002[4]: Information disclosure via headers",\n    "VULN-003[8]: SQL injection in search endpoint",\n]\n\nvulnerabilities = find_vulnerabilities(logs)\ncritical = [v for v in vulnerabilities if v.severity >= 7]\ncritical = sorted(critical, key=lambda v: v.severity, reverse=True)\n\nprint(f"Critical vulnerabilities: {len(critical)}")\nfor v in critical:\n    print(f"{v.id} (severity {v.severity}): {v.description}")',

  testCases: [
    {
      id: 'tc01',
      description: 'Should find and display critical vulnerabilities',
      expectedOutput: 'Critical vulnerabilities: 2\nVULN-001 (severity 9): Remote code execution in auth module\nVULN-003 (severity 8): SQL injection in search endpoint',
      hidden: false,
    },
    {
      id: 'tc02',
      description: 'Should combine regex, classes, sorting, and filtering',
      expectedOutput: 'Critical vulnerabilities: 2\nVULN-001 (severity 9): Remote code execution in auth module\nVULN-003 (severity 8): SQL injection in search endpoint',
      hidden: true,
    },
  ],

  hints: [
    { tier: 1 as const, text: 'Use startswith() and string index/slice to parse log entries. Use a class for structured data.' },
    { tier: 2 as const, text: 'Filter with list comprehension, sort with sorted() and a lambda key.' },
    { tier: 3 as const, text: 'Solution: check startswith("VULN-"), use index("["), index("]"), index(": ") to extract fields.' },
  ],

  roomId: 'floor_12_room_01',
  terminalId: 'terminal_10',
  preDialogKey: 'dialog.ch12_10.pre',
  postDialogKey: 'dialog.ch12_10.post',

  conceptsIntroduced: ['full_integration', 'vulnerability_analysis'],
  conceptsReinforced: ['class_definition', 'regular_expressions', 'list_comprehension', 'lambda', 'sorting'],
};
