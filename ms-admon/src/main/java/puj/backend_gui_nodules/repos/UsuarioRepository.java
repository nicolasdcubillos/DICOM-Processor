package puj.backend_gui_nodules.repos;

import puj.backend_gui_nodules.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
