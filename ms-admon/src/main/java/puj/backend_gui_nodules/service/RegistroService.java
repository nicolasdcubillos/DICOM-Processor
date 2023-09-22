package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.Registro;
import puj.backend_gui_nodules.domain.TipoRegistro;
import puj.backend_gui_nodules.domain.Usuario;
import puj.backend_gui_nodules.model.RegistroCompleteDTO;
import puj.backend_gui_nodules.model.RegistroDTO;
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

    public RegistroService(final RegistroRepository registroRepository,
            final UsuarioRepository usuarioRepository,
            final TipoRegistroRepository tipoRegistroRepository) {
        this.registroRepository = registroRepository;
        this.usuarioRepository = usuarioRepository;
        this.tipoRegistroRepository = tipoRegistroRepository;
    }

    public List<RegistroCompleteDTO> findAll() {
        final List<Registro> registros = registroRepository.findAll(Sort.by("id"));
        return registros.stream()
                .map(registro -> mapToCompleteDTO(registro, new RegistroCompleteDTO()))
                .toList();
    }

    public RegistroDTO get(final Integer id) {
        return registroRepository.findById(id)
                .map(registro -> mapToDTO(registro, new RegistroDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public RegistroCompleteDTO getByUuid(final String uuid) {
        return registroRepository.findByUuid(uuid)
                .map(registro -> mapToCompleteDTO(registro, new RegistroCompleteDTO()))
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
        registroDTO.setUuid(registro.getUuid());
        registroDTO.setUsuario(registro.getUsuario() == null ? null : registro.getUsuario().getId());
        registroDTO.setTipoRegistro(registro.getTipoRegistro() == null ? null : registro.getTipoRegistro().getId());
        return registroDTO;
    }

    private RegistroCompleteDTO mapToCompleteDTO(final Registro registro, final RegistroCompleteDTO registroCompleteDTO) {
        registroCompleteDTO.setId(registro.getId());
        registroCompleteDTO.setFecha(registro.getFecha());
        registroCompleteDTO.setUuid(registro.getUuid());
        registroCompleteDTO.setUsuario(registro.getUsuario() == null ? null : registro.getUsuario());
        registroCompleteDTO.setTipoRegistro(registro.getTipoRegistro() == null ? null : registro.getTipoRegistro());
        return registroCompleteDTO;
    }

    private Registro mapToEntity(final RegistroDTO registroDTO, final Registro registro) {
        registro.setFecha(registroDTO.getFecha());
        registro.setUuid(registroDTO.getUuid());
        final Usuario usuario = registroDTO.getUsuario() == null ? null : usuarioRepository.findById(registroDTO.getUsuario())
                .orElseThrow(() -> new NotFoundException("usuario not found"));
        registro.setUsuario(usuario);
        final TipoRegistro tipoRegistro = registroDTO.getTipoRegistro() == null ? null : tipoRegistroRepository.findById(registroDTO.getTipoRegistro())
                .orElseThrow(() -> new NotFoundException("tipoRegistro not found"));
        registro.setTipoRegistro(tipoRegistro);
        return registro;
    }

}
