package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.Parametro;
import puj.backend_gui_nodules.domain.Usuario;
import puj.backend_gui_nodules.model.ParametroDTO;
import puj.backend_gui_nodules.repos.ParametroRepository;
import puj.backend_gui_nodules.repos.UsuarioRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ParametroService {

    private final ParametroRepository parametroRepository;
    private final UsuarioRepository usuarioRepository;

    public ParametroService(final ParametroRepository parametroRepository,
            final UsuarioRepository usuarioRepository) {
        this.parametroRepository = parametroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ParametroDTO> findAll() {
        final List<Parametro> parametros = parametroRepository.findAll(Sort.by("id"));
        return parametros.stream()
                .map(parametro -> mapToDTO(parametro, new ParametroDTO()))
                .toList();
    }

    public ParametroDTO get(final Integer id) {
        return parametroRepository.findById(id)
                .map(parametro -> mapToDTO(parametro, new ParametroDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ParametroDTO parametroDTO) {
        final Parametro parametro = new Parametro();
        mapToEntity(parametroDTO, parametro);
        return parametroRepository.save(parametro).getId();
    }

    public void update(final Integer id, final ParametroDTO parametroDTO) {
        final Parametro parametro = parametroRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(parametroDTO, parametro);
        parametroRepository.save(parametro);
    }

    public void delete(final Integer id) {
        parametroRepository.deleteById(id);
    }

    private ParametroDTO mapToDTO(final Parametro parametro, final ParametroDTO parametroDTO) {
        parametroDTO.setId(parametro.getId());
        parametroDTO.setParametro(parametro.getParametro());
        parametroDTO.setValor(parametro.getValor());
        parametroDTO.setUsuarioModifica(parametro.getUsuarioModifica() == null ? null : parametro.getUsuarioModifica().getId());
        return parametroDTO;
    }

    private Parametro mapToEntity(final ParametroDTO parametroDTO, final Parametro parametro) {
        parametro.setParametro(parametroDTO.getParametro());
        parametro.setValor(parametroDTO.getValor());
        final Usuario usuarioModifica = parametroDTO.getUsuarioModifica() == null ? null : usuarioRepository.findById(parametroDTO.getUsuarioModifica())
                .orElseThrow(() -> new NotFoundException("usuarioModifica not found"));
        parametro.setUsuarioModifica(usuarioModifica);
        return parametro;
    }

}
