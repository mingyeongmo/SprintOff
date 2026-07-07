import type { Prisma } from "@prisma/client";

type ActiveVacationOverlapInput = {
  userId: string;
  companyId: string;
  startDate: Date;
  endDate: Date;
};

export const buildActiveVacationOverlapWhere = (
  input: ActiveVacationOverlapInput,
): Prisma.VacationRequestWhereInput => ({
  userId: input.userId,
  companyId: input.companyId,
  status: {
    in: ["PENDING", "APPROVED"],
  },
  startDate: {
    lte: input.endDate,
  },
  endDate: {
    gte: input.startDate,
  },
});
