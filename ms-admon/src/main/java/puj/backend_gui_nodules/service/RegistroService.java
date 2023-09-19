package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.ImagenTac;
import puj.backend_gui_nodules.domain.Registro;
import puj.backend_gui_nodules.domain.TipoRegistro;
import puj.backend_gui_nodules.domain.Usuario;
import puj.backend_gui_nodules.model.RegistroDTO;
import puj.backend_gui_nodules.repos.ImagenTacRepository;
import puj.backend_gui_nodules.repos.RegistroRepository;
import puj.backend_gui_nodules.repos.TipoRegistroRepository;
import puj.backend_gui_nodules.repos.UsuarioRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class RegistroService {

    private final RegistroRepository registroRepository;
    private final UsuarioRepository usuarioRepository;
    private final TipoRegistroRepository tipoRegistroRepository;
    private final ImagenTacRepository imagenTacRepository;

    public RegistroService(final RegistroRepository registroRepository,
            final UsuarioRepository usuarioRepository,
            final TipoRegistroRepository tipoRegistroRepository,
            final ImagenTacRepository imagenTacRepository) {
        this.registroRepository = registroRepository;
        this.usuarioRepository = usuarioRepository;
        this.tipoRegistroRepository = tipoRegistroRepository;
        this.imagenTacRepository = imagenTacRepository;
    }

    public List<RegistroDTO> findAll() {
        final List<Registro> registros = registroRepository.findAll(Sort.by("id"));
        return registros.stream()
                .map(registro -> mapToDTO(registro, new RegistroDTO()))
                .toList();
    }

    public RegistroDTO get(final Integer id) {
        return registroRepository.findById(id)
                .map(registro -> mapToDTO(registro, new RegistroDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final RegistroDTO registroDTO) {
        final Registro registro = new Registro();
        mapToEntity(registroDTO, registro);
        return registroRepository.save(registro).getId();
    }

    public void update(final Integer id, final RegistroDTO registroDTO) {
        final Registro registro = registroRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(registroDTO, registro);
        registroRepository.save(registro);
    }

    public void delete(final Integer id) {
        registroRepository.deleteById(id);
    }

    private RegistroDTO mapToDTO(final Registro registro, final RegistroDTO registroDTO) {
        registroDTO.setId(registro.getId());
        registroDTO.setFecha(registro.getFecha());
        registroDTO.setUsuario(registro.getUsuario() == null ? null : registro.getUsuario().getId());
        registroDTO.setTipoRegistro(registro.getTipoRegistro() == null ? null : registro.getTipoRegistro().getId());
        registroDTO.setImagenTacid(registro.getImagenTacid() == null ? null : registro.getImagenTacid().getId());
        return registroDTO;
    }

    private Registro mapToEntity(final RegistroDTO registroDTO, final Registro registro) {
        registro.setFecha(registroDTO.getFecha());
        final Usuario usuario = registroDTO.getUsuario() == null ? null : usuarioRepository.findById(registroDTO.getUsuario())
                .orElseThrow(() -> new NotFoundException("usuario not found"));
        registro.setUsuario(usuario);
        final TipoRegistro tipoRegistro = registroDTO.getTipoRegistro() == null ? null : tipoRegistroRepository.findById(registroDTO.getTipoRegistro())
                .orElseThrow(() -> new NotFoundException("tipoRegistro not found"));
        registro.setTipoRegistro(tipoRegistro);
        final ImagenTac imagenTacid = registroDTO.getImagenTacid() == null ? null : imagenTacRepository.findById(registroDTO.getImagenTacid())
                .orElseThrow(() -> new NotFoundException("imagenTacid not found"));
        registro.setImagenTacid(imagenTacid);
        return registro;
    }

}
