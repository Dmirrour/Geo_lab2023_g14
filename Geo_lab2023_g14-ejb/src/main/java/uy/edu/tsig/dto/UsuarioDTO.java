package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO implements Serializable {
	
	private String usuario;
	private String pass;
	
	public UsuarioDTO(){
		super();
	}
	
	public UsuarioDTO(String usuario,String pass) {
		super();
		this.usuario=usuario;
		this.pass=pass;
	}
	

	public String getUsuario() {
		return usuario;
	}
	
	public String getPass() {
		return pass;
	}

	
	
}
