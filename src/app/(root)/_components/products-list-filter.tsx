"use client";

import { useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const ProductsListFilter = () => {
  const [searchQuery, setSearchQuery] = useQueryStates(
    {
      maxPrice: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      maxPreparationTime: parseAsInteger
        .withDefault(0)
        .withOptions({ clearOnDefault: true }),
      minimumServes: parseAsInteger
        .withDefault(1)
        .withOptions({ clearOnDefault: true }),
      maxCalories: parseAsInteger
        .withDefault(0)
        .withOptions({ clearOnDefault: true }),
      ingredients: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
      allergens: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
    },
    {
      history: "push",
      shallow: true,
    },
  );

  const [allFilters, setAllFilters] = useState({
    maxPrice: searchQuery.maxPrice || "",
    maxPreparationTime: searchQuery.maxPreparationTime || 0,
    minimumServes: searchQuery.minimumServes || 1,
    maxCalories: searchQuery.maxCalories || 0,
    ingredients: searchQuery.ingredients || "",
    allergens: searchQuery.allergens || "",
  });

  const handleFilter = async () => {
    await setSearchQuery(
      { ...allFilters },
      {
        shallow: false,
      },
    );
  };

  const clearFilter = async () => {
    setAllFilters({
      maxPrice: "",
      maxPreparationTime: 0,
      minimumServes: 1,
      maxCalories: 0,
      ingredients: "",
      allergens: "",
    });

    await setSearchQuery(
      {
        maxPrice: "",
        maxPreparationTime: 0,
        minimumServes: 1,
        maxCalories: 0,
        ingredients: "",
        allergens: "",
      },
      {
        shallow: false,
      },
    );
  };

  return (
    <div className="h-max w-full rounded-xl border p-2">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="maxPriceInput" className="text-sm font-medium">
                Max price:
              </Label>
              <Input
                type="text"
                id="maxPriceInput"
                value={allFilters.maxPrice}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value,
                  }))
                }
                placeholder="e.g. 10.00"
                className="w-full border-primary/40"
              />
            </div>
            <div>
              <Label
                htmlFor="maxPreparationTimeLabel"
                className="text-sm font-medium"
              >
                Max preparation time:
              </Label>
              <Input
                type="number"
                id="maxPreparationTimeLabel"
                value={allFilters.maxPreparationTime}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    maxPreparationTime: Number(e.target.value),
                  }))
                }
                className="w-full border-primary/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label
                htmlFor="minimumServesInput"
                className="text-sm font-medium"
              >
                Minimum serves:
              </Label>
              <Input
                type="number"
                id="minimumServesInput"
                value={allFilters.minimumServes}
                min={1}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    minimumServes: Number(e.target.value),
                  }))
                }
                className="w-full border-primary/40"
              />
            </div>
            <div>
              <Label htmlFor="maxCaloriesInput" className="text-sm font-medium">
                Max calories:
              </Label>
              <Input
                type="number"
                id="maxCaloriesInput"
                value={allFilters.maxCalories}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    maxCalories: Number(e.target.value),
                  }))
                }
                className="w-full border-primary/40"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="ingredientsInput" className="text-sm font-medium">
                Ingredients:
              </Label>
              <Input
                type="text"
                id="ingredientsInput"
                value={allFilters.ingredients}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    ingredients: e.target.value,
                  }))
                }
                placeholder="e.g. eggs, flour"
                className="w-full border-primary/40"
              />
            </div>
            <div>
              <Label htmlFor="allergensInput" className="text-sm font-medium">
                Allergens:
              </Label>
              <Input
                type="text"
                id="allergensInput"
                value={allFilters.allergens}
                onChange={(e) =>
                  setAllFilters((prev) => ({
                    ...prev,
                    allergens: e.target.value,
                  }))
                }
                placeholder="e.g. eggs, gluten"
                className="w-full border-primary/40"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilter}
            className="w-max"
          >
            Clear
          </Button>
          <Button size="sm" onClick={handleFilter} className="w-max">
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};
