package puj.backend_gui_nodules.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserTypeDTO {

    private Integer id;

    @Size(max = 255)
    private String rol;

}
