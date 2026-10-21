import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./layout/header/header";
import { AuthModal } from "./shared/components/auth-modal/auth-modal";
import { Toast } from "./shared/components/toast/toast";
import { PAGE_TRANSITION } from "./animations";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, Header, AuthModal, Toast],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
  animations: [PAGE_TRANSITION],
})
export class App {}
