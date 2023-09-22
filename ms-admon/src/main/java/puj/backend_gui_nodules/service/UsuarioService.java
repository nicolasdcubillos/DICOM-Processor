package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.TipoUsuario;
import puj.backend_gui_nodules.domain.Usuario;
import puj.backend_gui_nodules.model.UsuarioDTO;
import puj.backend_gui_nodules.repos.TipoUsuarioRepository;
import puj.backend_gui_nodules.repos.UsuarioRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final TipoUsuarioRepository tipoUsuarioRepository;

    public UsuarioService(final UsuarioRepository usuarioRepository,
            final TipoUsuarioRepository tipoUsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.tipoUsuarioRepository = tipoUsuarioRepository;
    }

    public List<UsuarioDTO> findAll() {
        final List<Usuario> usuarios = usuarioRepository.findAll(Sort.by("id"));
        return usuarios.stream()
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .toList();
    }

    public UsuarioDTO get(final Integer id) {
        return usuarioRepository.findById(id)
                .map(usuario -> mapToDTO(usuario, new UsuarioDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final UsuarioDTO usuarioDTO) {
        final Usuario usuario = new Usuario();
        mapToEntity(usuarioDTO, usuario);
        return usuarioRepository.save(usuario).getId();
    }

    public void update(final Integer id, final UsuarioDTO usuarioDTO) {
        final Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(usuarioDTO, usuario);
        usuarioRepository.save(usuario);
    }

    public void delete(final Integer id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO mapToDTO(final Usuario usuario, final UsuarioDTO usuarioDTO) {
        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setApellido(usuario.getApellido());
        usuarioDTO.setUsername(usuario.getUsername());
        usuarioDTO.setPass(usuario.getPass());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setTelefono(usuario.getTelefono());
        usuarioDTO.setTipoUsuario(usuario.getTipoUsuario() == null ? null : usuario.getTipoUsuario().getId());
        return usuarioDTO;
    }

    private Usuario mapToEntity(final UsuarioDTO usuarioDTO, final Usuario usuario) {
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setApellido(usuarioDTO.getApellido());
        usuario.setUsername(usuarioDTO.getUsername());
        usuario.setPass(usuarioDTO.getPass());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setTelefono(usuarioDTO.getTelefono());
        final TipoUsuario tipoUsuario = usuarioDTO.getTipoUsuario() == null ? null : tipoUsuarioRepository.findById(usuarioDTO.getTipoUsuario())
                .orElseThrow(() -> new NotFoundException("tipoUsuario not found"));
        usuario.setTipoUsuario(tipoUsuario);
        return usuario;
    }

}
