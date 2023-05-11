package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Remote;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.entity.Usuario;
import uy.edu.tsig.persistence.IUsuarioDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

@Stateless
public class UsuarioDAO implements IUsuarioDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;
    @Override
    public UsuarioDTO buscarUsuario(String usuario){
        Usuario u= em.find(Usuario.class, usuario);
        UsuarioDTO ur= new UsuarioDTO(u.getUsuario(),u.getPass());
        return ur;
    }
    @Override
    public UsuarioDTO InicioSecion(String usuario, String pass){
        Usuario u= em.find(Usuario.class, usuario);

        if(u!=null && u.getPass().equals(pass)){
            UsuarioDTO ur= new UsuarioDTO(u.getUsuario(),u.getPass());
            return ur;
        }else{
            return null;
        }
    }
}
