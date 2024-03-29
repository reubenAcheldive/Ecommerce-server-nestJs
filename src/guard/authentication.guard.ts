import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp(),
      Request = host.getRequest();

    const user = Request["user"];

    if (!user) {
   

      throw new UnauthorizedException();
    }
    return true;
  }
}

