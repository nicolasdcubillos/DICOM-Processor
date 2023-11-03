package puj.backend_gui_nodules.model;

import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParameterDTO {

    private Integer id;

    @Size(max = 255)
    private String Parameter;

    @Size(max = 255)
    private String Value;

    @Size(max = 255)
    private String Description;

    private Integer ModifyUserid;

}
