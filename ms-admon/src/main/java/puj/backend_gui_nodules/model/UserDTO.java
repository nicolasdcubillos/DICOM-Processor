package puj.backend_gui_nodules.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDTO {

    private Integer id;

    @Size(max = 255)
    private String nombre;

    @Size(max = 255)
    private String apellido;

    @Size(max = 255)
    private String username;

    @Size(max = 255)
    private String pass;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String telefono;

    private Integer tipoUsuario;

}
