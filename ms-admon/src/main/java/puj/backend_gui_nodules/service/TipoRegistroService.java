package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.TipoRegistro;
import puj.backend_gui_nodules.model.TipoRegistroDTO;
import puj.backend_gui_nodules.repos.TipoRegistroRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class TipoRegistroService {

    private final TipoRegistroRepository tipoRegistroRepository;

    public TipoRegistroService(final TipoRegistroRepository tipoRegistroRepository) {
        this.tipoRegistroRepository = tipoRegistroRepository;
    }

    public List<TipoRegistroDTO> findAll() {
        final List<TipoRegistro> tipoRegistros = tipoRegistroRepository.findAll(Sort.by("id"));
        return tipoRegistros.stream()
                .map(tipoRegistro -> mapToDTO(tipoRegistro, new TipoRegistroDTO()))
                .toList();
    }

    public TipoRegistroDTO get(final Integer id) {
        return tipoRegistroRepository.findById(id)
                .map(tipoRegistro -> mapToDTO(tipoRegistro, new TipoRegistroDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final TipoRegistroDTO tipoRegistroDTO) {
        final TipoRegistro tipoRegistro = new TipoRegistro();
        mapToEntity(tipoRegistroDTO, tipoRegistro);
        return tipoRegistroRepository.save(tipoRegistro).getId();
    }

    public void update(final Integer id, final TipoRegistroDTO tipoRegistroDTO) {
        final TipoRegistro tipoRegistro = tipoRegistroRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(tipoRegistroDTO, tipoRegistro);
        tipoRegistroRepository.save(tipoRegistro);
    }

    public void delete(final Integer id) {
        tipoRegistroRepository.deleteById(id);
    }

    private TipoRegistroDTO mapToDTO(final TipoRegistro tipoRegistro,
            final TipoRegistroDTO tipoRegistroDTO) {
        tipoRegistroDTO.setId(tipoRegistro.getId());
        tipoRegistroDTO.setTipoRegistro(tipoRegistro.getTipoRegistro());
        return tipoRegistroDTO;
    }

    private TipoRegistro mapToEntity(final TipoRegistroDTO tipoRegistroDTO,
            final TipoRegistro tipoRegistro) {
        tipoRegistro.setTipoRegistro(tipoRegistroDTO.getTipoRegistro());
        return tipoRegistro;
    }

    public boolean tipoRegistroExists(final String tipoRegistro) {
        return tipoRegistroRepository.existsByTipoRegistroIgnoreCase(tipoRegistro);
    }

}
