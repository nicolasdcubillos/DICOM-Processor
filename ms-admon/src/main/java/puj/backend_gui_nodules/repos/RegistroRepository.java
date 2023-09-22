package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface RegistroRepository extends JpaRepository<Registro, Integer> {
    Optional<Registro> findByUuid(String uuid);
}
