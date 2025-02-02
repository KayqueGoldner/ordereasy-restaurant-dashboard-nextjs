import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";

export function useExpandHome() {
  const [state, setState] = useQueryState(
    "expanded-home-list",
    parseAsBoolean
      .withDefault(
        JSON.parse(localStorage.getItem("expanded-home-list") ?? "false"),
      )
      .withOptions({
        clearOnDefault: false,
      }),
  );

  useEffect(() => {
    localStorage.setItem("expanded-home-list", JSON.stringify(state));
  }, [state]);

  return {
    isExpanded: state,
    changeExpanded: setState,
  };
}
