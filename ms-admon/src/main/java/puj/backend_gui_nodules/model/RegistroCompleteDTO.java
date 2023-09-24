package puj.backend_gui_nodules.model;

import lombok.Getter;
import lombok.Setter;
import puj.backend_gui_nodules.domain.TipoRegistro;
import puj.backend_gui_nodules.domain.Usuario;

import java.time.LocalDate;
@Getter
@Setter
public class RegistroCompleteDTO {

    private Integer id;
    private LocalDate fecha;
    private String uuid;
    private String nombrePaciente;
    private String nombreEstudio;
    private byte[] imagenPrevia;
    private Usuario usuario;
    private TipoRegistro tipoRegistro;
}
