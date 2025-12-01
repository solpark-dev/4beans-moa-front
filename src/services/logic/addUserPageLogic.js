// src/services/logic/addUserPageLogic.js
import { bindValidationEvents } from "./addUserPage/validation";
import { bindApiEvents } from "./addUserPage/api";
import { bindImageEvents } from "./addUserPage/image";
import { bindSubmitEvent } from "./addUserPage/events";

export function initSignupPage() {
  bindValidationEvents();
  bindApiEvents();
  bindImageEvents();
  bindSubmitEvent();
}
