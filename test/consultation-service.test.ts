import { ConsultationService } from "../src/service/consultation-service";

describe("ConsultationService tie-breaking logic", () => {
  it("prefers the more specific rule when priority is equal", () => {
    const rules = [
      {
        id: 1,
        priority: 8,
        ruleConditions: [{ factId: 8 }],
        ruleResults: [{ conclusionId: 8 }],
      },
      {
        id: 2,
        priority: 8,
        ruleConditions: [{ factId: 8 }, { factId: 11 }],
        ruleResults: [{ conclusionId: 11 }],
      },
    ];

    const conclusionId = ConsultationService.selectBestMatchedRule(
      rules,
      [8, 11],
    );

    expect(conclusionId).toBe(11);
  });
});
