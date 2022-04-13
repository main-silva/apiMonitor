import {Component, OnInit} from "@angular/core";
import {Status} from "src/models/status";
import {HealthService} from "../services/health.service";
import {Micro} from "../models/micro";
import {ConfigService} from "../services/config.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "BVFM APIs Monitoring";
  micros: Array<Micro> = [];

  constructor(private healthService: HealthService, private configService : ConfigService) {}

  ngOnInit() {
    this.listApis();
  }

  listApis(){
    this.micros = [];
    for(let u of this.configService.getUrls()){
      let m = <Micro>{};
      m.url = u;
      m.name = this.getAppName(u);
      m.path = this.getNamespace(u);
      m.git = this.getGit(m.name, m.path);
      m.swagger = this.getSwagger(u, "prd");
      m.jenkins = this.getJenkins(m.name, m.path);
      m.opc = this.getOpc(m.path);
      m.dev = this.getProbe(u, "dev");
      m.hom = this.getProbe(u, "hom");
      m.prd = this.getProbe(u, "prd");
      m.probePrd = this.isUp(m.prd);
      m.probeHom = this.isUp(m.hom);
      m.probeDev = this.isUp(m.dev);
      this.micros.push(m);
    }
  }

  getAppName(url: string):string{
    let endingEl = url.includes("-v1")? "-v1" : "-prd";
    return url.split("//")[1].split(endingEl)[0];
  }

  getNamespace(url: string):string{
    return url.split("prd-")[1].split(".app")[0];
  }

  getJenkins(appName: String, namespace: String):string {
    return `https://cid.sascar.com.br/job/${namespace.replace("-", "/job/")}/job/${appName}`;
  }

  getOpc(namespace: String):string {
    return `https://opc-dev.sascar.com.br:8443/console/project/dev-${namespace}/browse/deployments`;
  }

  getGit(appName: String, namespace: String):string {
    return `https://git.sascar.com.br/${namespace.replace("-", "/")}/${appName}`;
  }


  getProbe(url: string, env: string){
    return this.changeEnv(url, env).concat("/actuator/health");
  }

  getSwagger(url: string, env: string){
    return this.changeEnv(url, env).concat("/swagger-ui.html");
  }

  changeEnv(url: string, env: string){
    let liveProbe = url;
    if(env != "prd"){
      liveProbe = url.replace("-prd-", `-${env}-`).replace(".app.", ".app-dev.");
    }
    return liveProbe;
  }

  isUp(url: string):boolean{
    let alive = false;
    this.healthService.getStatus(url).subscribe((status: Status) => {
      if(status != null && status.status == "UP"){
        alive = true;
      }
    });
    return alive;
  }




}
