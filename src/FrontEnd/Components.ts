import { ChargesPage } from "./ChargesPage"
import { LoginPage } from "./LoginPage"
import { OAPPage } from "./OAPPage"
import { PasswordPage } from "./PasswordPage"
import { SubjectivePage } from "./SubjectivePage"

export abstract class Component
{
    static RegisterEvents: () => void
}

export const Components: (typeof Component)[] = 
[
    LoginPage,
    SubjectivePage,
    PasswordPage,
    OAPPage,
    ChargesPage
]