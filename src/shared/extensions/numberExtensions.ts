declare global {
  interface NumberConstructor {
    tryParse(str: string | null | undefined): { success: boolean; value?: number };
    isNumber(str: string | null | undefined): boolean;
  }
}

Number.tryParse = function (str: string | null | undefined): { success: boolean; value?: number } {
  if (typeof str == 'number') {
    return { success: true, value: str };
  }

  if (typeof str != 'string') {
    return { success: false };
  }

  if (!Number.isNumber(str)) {
    return { success: false }
  }

  return { success: true, value: parseFloat(str) }
};

Number.isNumber = function (value: string | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
};

export {};
