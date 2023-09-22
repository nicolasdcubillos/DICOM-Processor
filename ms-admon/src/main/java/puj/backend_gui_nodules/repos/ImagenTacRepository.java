package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.ImagenTac;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ImagenTacRepository extends JpaRepository<ImagenTac, Integer> {

    boolean existsByIdentificadorIgnoreCase(String identificador);

}
