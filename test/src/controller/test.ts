import { Plugin, Component, Decorator, Context, Scope } from '../../../src/index';
const Controller = Decorator.Controller;

// @Controller.Prefix() 
// export default class TestController extends Component.Controller {
//   constructor(plugin: Plugin) {
//     super(plugin);
//   }
  
//   @Controller.Get('/abc')
//   // @Controller.Request.Static.Validator.Header('test')
//   // @Controller.Request.Static.Validator.Query('abc')
//   abc(ctx: Context) {
//     ctx.body = 'hello world' + ctx.query.a + ctx.query.b;
//   }
// }

export default Scope((app: Plugin) => {

  @Controller.Prefix() 
  class TestController extends Component.Controller {
    constructor(plugin: Plugin) {
      super(plugin);
    }
    
    @Controller.Get('/abc')
    // @Controller.Request.Static.Validator.Header('test')
    // @Controller.Request.Static.Validator.Query('abc')
    abc(ctx: Context) {
      ctx.body = 'hello world' + ctx.query.a + ctx.query.b;
    }
  }

  return TestController;
})