import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn - class name helper", () => {
  it("TC_UTIL_CN_001 merges conflicting Tailwind utilities and keeps the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-muted-foreground", "text-lg")).toBe(
      "text-muted-foreground text-lg",
    );
  });

  it("TC_UTIL_CN_002 keeps non-conflicting utilities from every argument", () => {
    expect(cn("flex", "items-center", "gap-2", "rounded-md")).toBe(
      "flex items-center gap-2 rounded-md",
    );
  });

  it("TC_UTIL_CN_003 ignores falsy conditional values", () => {
    const isActive = false;
    expect(cn("base", isActive && "active", undefined, null)).toBe("base");
  });

  it("TC_UTIL_CN_004 supports object and array class inputs", () => {
    expect(cn({ hidden: true, block: false }, ["m-1", "m-2"])).toBe(
      "hidden m-2",
    );
  });
});