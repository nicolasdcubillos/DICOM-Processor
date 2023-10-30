package puj.backend_gui_nodules.model;

import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecordTypeDTO {

    private Integer id;

    @Size(max = 255)
    private String tipoRegistro;

}
