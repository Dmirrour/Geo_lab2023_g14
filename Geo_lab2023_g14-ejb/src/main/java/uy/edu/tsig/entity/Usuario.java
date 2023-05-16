package uy.edu.tsig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data // Getter y Setter
@Builder
@AllArgsConstructor // Consdtructor con argumentos
@NoArgsConstructor // Consdtructor sin argumentos
@Entity
public class Usuario implements Serializable {
	private static final Long serialVersionUID = 1L;
	@Id
	private String usuario;
	private String pass;
}
