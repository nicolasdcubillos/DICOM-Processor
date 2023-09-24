package puj.backend_gui_nodules.model;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RegistroDTO {

    private Integer id;
    private LocalDate fecha;
    private String uuid;
    private String nombrePaciente;
    private String nombreEstudio;
    private byte[] imagenPrevia;
    private Integer usuario;
    private Integer tipoRegistro;

}
