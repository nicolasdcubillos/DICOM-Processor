package puj.backend_gui_nodules.model;

import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {

    private Integer id;

    @Size(max = 255)
    private String Name;

    @Size(max = 255)
    private String LastName;

    @Size(max = 255)
    private String UserName;

    @Size(max = 255)
    private String Pass;

    @Size(max = 255)
    private String Email;

    @Size(max = 255)
    private String Phone;

    private Integer UserTypeid;

}
