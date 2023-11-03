package puj.backend_gui_nodules.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String Name;

    @Column
    private String LastName;

    @Column
    private String UserName;

    @Column
    private String Pass;

    @Column
    private String Email;

    @Column
    private String Phone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_usuario_id")
    private UserType UserTypeid;

}
