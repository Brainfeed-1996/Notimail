/**
 * Throw quand une `Session` n'as pas les permissions requise pour executer un requête
 */
export default class PermissionException extends Error {
  constructor() {
    super("Unauthorized");
  }
}
