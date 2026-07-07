import assert from "node:assert/strict";
import test from "node:test";

test("활성 상태의 겹치는 휴가 신청을 찾는 조회 조건을 만든다", async () => {
  const modulePath = "./vacationRequestOverlap.ts";
  const { buildActiveVacationOverlapWhere } = await import(modulePath);
  const startDate = new Date("2026-07-10T00:00:00.000Z");
  const endDate = new Date("2026-07-12T00:00:00.000Z");

  const where = buildActiveVacationOverlapWhere({
    userId: "user-1",
    companyId: "company-1",
    startDate,
    endDate,
  });

  assert.deepEqual(where, {
    userId: "user-1",
    companyId: "company-1",
    status: {
      in: ["PENDING", "APPROVED"],
    },
    startDate: {
      lte: endDate,
    },
    endDate: {
      gte: startDate,
    },
  });
});
