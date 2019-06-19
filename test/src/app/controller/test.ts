import { Plugin, Component, Decorator, Scope } from '../../../../src/index';
const Controller = Decorator.Controller;

export default Scope<Function>((app: Plugin) => {
  
  @Controller.Prefix() 
  class TestController extends Component.Controller {
    constructor(plugin: Plugin) {
      super(plugin);
    }
    
    @Controller.Get('/abc')
    @Controller.Request.Static.Validator.Header('test')
    @Controller.Request.Static.Validator.Query('abc')
    abc() {
  
    }
  }

  return TestController;
})