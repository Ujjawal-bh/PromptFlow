import type { ActionResult, FieldErrors } from "@/types/actions";

/** Field errors are only present when `ok` is false. */
export function getFieldErrors<T = void>(state: ActionResult<T> | undefined): FieldErrors | undefined {
  if (!state || state.ok) {
    return undefined;
  }
  return state.fieldErrors;
}

export function getFieldErrorMessages<T = void>(
  state: ActionResult<T> | undefined,
  field: string,
): string[] | undefined {
  return getFieldErrors(state)?.[field];
}
