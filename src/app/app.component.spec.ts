import { AppComponent } from "./app.component";
import { JsonPlaceholderService } from './shared/services/json-placeholder/json-placeholder.service';
import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { LogType } from './shared/models/LogType';
import { Post } from './shared/models/Post';
import { RouterTestingModule } from '@angular/router/testing'
import {Router} from '@angular/router'
import { Location } from '@angular/common';
import {routes} from './app-routing.module'
fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let spyJsonPlaceholderService: jasmine.SpyObj<JsonPlaceholderService>;
  let router: Router;
  let location: Location;
    beforeAll(() => {
    spyJsonPlaceholderService = jasmine.createSpyObj<JsonPlaceholderService>
    ('JsonPlaceholderService', ['getPosts']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: JsonPlaceholderService, useValue: spyJsonPlaceholderService
        }
      ],
      declarations: [AppComponent],
      imports:[RouterTestingModule.withRoutes(routes)]
    });
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    router.initialNavigation();
  });


  it('should create successfully', () => {
    expect(component).toBeDefined();
  });

  it('should set the title correctly', () => {
    component.setTitle('new-title');
    expect(component.title).toEqual('new-title');
  });

  it('should set the posts array to the result of getPosts() called from the jsonPlaceholderService', () => {
    const MOCK_POSTS: Post[] = [
      {
        id: 1,
        userId: 1,
        body: 'body1',
        title: 'title1'
      },
      {
        id: 2,
        userId: 2,
        body: 'body2',
        title: 'title2'
      },
      {
        id: 3,
        userId: 3,
        body: 'body3',
        title: 'title3'
      }
    ];
    spyJsonPlaceholderService.getPosts.and.returnValue(of(MOCK_POSTS));

    component.getPosts();

    expect(component.posts).toEqual(MOCK_POSTS);
  });

  /* 
    This one is failing because we dont have a HTMLElement with id app-title
    that displays the title of the app
  */
  it('should check if there is a div element with content unit-testing-demo', () => {
    const divElement: HTMLElement = fixture.nativeElement.querySelector('#app-title');
    expect(divElement.textContent).toEqual('unit-testing-demo');
  });

  it('should call logMessageInDatabase() when logger() is called with LogType.DATABASE', () => {
    const spyLogMessageInDatabase = spyOn(component, 'logMessageInDatabase');

    component.logger('some message', LogType.DATABASE);

    expect(spyLogMessageInDatabase).toHaveBeenCalledWith('some message');
  });

  it('should call logMessageInFile() when logger() is called with LogType.FILE', () => {
    const spyLogMessageInFile = spyOn(component, 'logMessageInFile');

    component.logger('some message', LogType.FILE);

    expect(spyLogMessageInFile).toHaveBeenCalledWith('some message');
  });

  it('should call console.log() when logger() is called with LogType.CONSOLE', () => {
    const spyLogMessageInConsole = spyOn(console, 'log');
    component.logger('some message', LogType.CONSOLE);
    expect(spyLogMessageInConsole).toHaveBeenCalledWith('some message');
  });


  it('should change the title of the component from unit-testing-demo to other-title', () => {
    component.setTitle('unit-testing-demo');
    expect(component.title).toEqual('unit-testing-demo');
      component.toggleTitle();
      expect(component.title).toEqual('other-title');
  });

  it('should toggle the title from other-title to unit-testing-demo', () => {
    component.setTitle('other-title');
    expect(component.title).toEqual('other-title');
    component.toggleTitle();
    expect(component.title).toEqual('unit-testing-demo');
  });

  /*
      <strong> Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()? </strong>

      That is the warning i get when the test fails
  */ 
  it('should navigate to / when navigate() is called',() => {
    component.navigate("");
    tick();
    expect(location.path()).toBe('/');
  });

/*
  it('should navigate to /about when navigate(/about) is called',fakeAsync(() => {
    component.navigate('/about');
    tick();
    expect(location.path()).toBe('/about');
  }));

  it('should navigate to /contact when navigate(/contact) is called',fakeAsync(() => {
    component.navigate('/contact');
    tick();
    expect(location.path()).toBe('/contact');
  }));
*/

});