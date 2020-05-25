import { createSelectorCreator, defaultMemoize } from "reselect";
import { isEqual } from "lodash-es";

export const createDeepSelectorCreator = createSelectorCreator(defaultMemoize, isEqual);
