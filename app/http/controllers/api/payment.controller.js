const Controller = require("../controller");

class PaymentController extends Controller {
    PaymentGateway(req,res,next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
}
module.exports =-{
    PaymentController:new PaymentController()
}