"use client";

import { TbShoppingBagSearch } from "react-icons/tb";
import { LuSearchX } from "react-icons/lu";
import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hint } from "@/components/hint";

export const HeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useQueryState("query", {
    defaultValue: "",
    history: "push",
    shallow: false,
    clearOnDefault: true,
  });
  const [query, setQuery] = useState(searchQuery);

  return (
    <div className="flex h-9 grow items-center gap-x-2">
      <div className="h-full flex-1 rounded-full border border-primary/40">
        <Input
          placeholder="Find your favorite meal."
          className="size-full rounded-full border-0"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(query);
            }
          }}
        />
      </div>
      <Hint text="Search" asChild>
        <Button
          className="size-9 rounded-full p-0"
          onClick={() => setSearchQuery(query)}
        >
          <TbShoppingBagSearch className="size-5" />
        </Button>
      </Hint>
      <Hint text="Clear search" asChild>
        <Button
          variant="outline"
          className="size-9 rounded-full p-0"
          onClick={() => {
            setSearchQuery("");
            setQuery("");
          }}
          disabled={!query}
        >
          <LuSearchX className="size-5" />
        </Button>
      </Hint>
    </div>
  );
};
