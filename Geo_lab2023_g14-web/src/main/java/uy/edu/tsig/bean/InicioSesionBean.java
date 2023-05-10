package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import uy.edu.tsig.service.IUsuarioSevice;

@Named("sesion")
@ViewScoped
public class InicioSesionBean {
   /* @EJB
    IUsuarioSevice iUsuarioSevice;*/
    private String usuario;
    private String pass;

    void iniciarSesion(String usuario,String pass){
        //iUsuarioSevice.incioSesion(usuario, pass);
        /*HttpSession sesion = request.getSession();
        sesion.setAttribute("LIntitucines",inst);*/

    }


}
