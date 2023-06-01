import { AfterContentInit, AfterViewInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { TabService } from '../../services/tab/tab.service';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  constructor(
    private tabService: TabService
  ) {
  }

  ngAfterContentInit() {
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: TabComponent){
    this.tabs.toArray().forEach(tab => tab.active = false);
    tab.active = true;
    this.tabService.setTab(tab.id);
  }
}
