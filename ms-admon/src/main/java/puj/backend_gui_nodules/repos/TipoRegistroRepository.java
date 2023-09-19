package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.TipoRegistro;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TipoRegistroRepository extends JpaRepository<TipoRegistro, Integer> {

    boolean existsByTipoRegistroIgnoreCase(String tipoRegistro);

}
