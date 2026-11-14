import { describe, expect, it } from "vitest";
import { createRoomSnapshot, roomStatusForEvent } from "../src/domain/room";

describe("议题房间生命周期", () => {
  it("新房间从草稿开始并保留审计时间", () => {
    const room = createRoomSnapshot({ id: "room-test-001", title: "测试议题", context: "测试约束", now: 100 });
    expect(room.status).toBe("draft");
    expect(room.createdAt).toBe(100);
    expect(room.updatedAt).toBe(100);
  });

  it("事件会推动房间进入可解释的生命周期状态", () => {
    expect(roomStatusForEvent("message.created")).toBe("running");
    expect(roomStatusForEvent("decision.ready")).toBe("review");
    expect(roomStatusForEvent("run.completed")).toBe("decided");
  });
});
