import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { ClientListComponent }    from './client-list/client-list.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';
import { ClientChartComponent }  from './client-chart/client-chart.component';
import { ClientAllChartComponent }  from './client-all-chart/client-all-chart.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { ReteComponent } from '../rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';
import { NumberComponent } from '../rete/controls/number-control';
import { MyNodeComponent } from '../rete/components/node/node.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule} from '@angular/material/tabs'
import { ClientDetailTabComponent } from './client-detail-tab/client-detail-tab.component';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule} from '@angular/material/list';
  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClientsRoutingModule,
    ReteModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
   
  ],
  declarations: [
    ClientListComponent,
    ClientDetailComponent,
    ClientChartComponent,
    ClientAllChartComponent,
    ClientDetailTabComponent,
    ReteComponent,
    NumberComponent,
    MyNodeComponent
  ],
  entryComponents: [NumberComponent, MyNodeComponent]
})
export class ClientsModule {}
