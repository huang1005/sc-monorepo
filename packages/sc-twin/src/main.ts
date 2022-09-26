import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { get } from "@runafe/platform-share";

import { useInit } from "@runafe/sc-three";

console.log(useInit);

createApp(App).mount("#app");
