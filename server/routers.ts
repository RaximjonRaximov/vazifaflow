import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { clearDoneTasks, createTask, deleteTask, listTasks, updateTask } from "./db";

const status = z.enum(["todo", "doing", "done"]);
const priority = z.enum(["low", "medium", "high"]);
const taskInput = z.object({
  title: z.string().trim().min(1, "Sarlavha kiritilishi kerak").max(180),
  description: z.string().trim().max(5000).optional().nullable(),
  priority: priority.default("medium"),
  dueDate: z.coerce.date().optional().nullable(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  tasks: router({
    list: publicProcedure.input(z.object({ search: z.string().optional() }).optional()).query(({ input }) => listTasks(input?.search)),
    create: publicProcedure.input(taskInput).mutation(({ input }) => createTask({ ...input, status: "todo" })),
    update: publicProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().trim().min(1).max(180).optional(), description: z.string().trim().max(5000).nullable().optional(), priority: priority.optional(), status: status.optional(), dueDate: z.coerce.date().nullable().optional() })).mutation(({ input }) => {
      const { id, ...data } = input; return updateTask(id, data);
    }),
    remove: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteTask(input.id)),
    clearDone: publicProcedure.mutation(() => clearDoneTasks()),
  }),
});

export type AppRouter = typeof appRouter;
