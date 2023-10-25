package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.RecordType;
import puj.backend_gui_nodules.model.RecordTypeDTO;
import puj.backend_gui_nodules.repos.RecordTypeRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class RecordTypeService {

    private final RecordTypeRepository recordTypeRepository;

    public RecordTypeService(final RecordTypeRepository recordTypeRepository) {
        this.recordTypeRepository = recordTypeRepository;
    }

    public List<RecordTypeDTO> findAll() {
        final List<RecordType> recordTypes = recordTypeRepository.findAll(Sort.by("id"));
        return recordTypes.stream()
                .map(tipoRegistro -> mapToDTO(tipoRegistro, new RecordTypeDTO()))
                .toList();
    }

    public RecordTypeDTO get(final Integer id) {
        return recordTypeRepository.findById(id)
                .map(tipoRegistro -> mapToDTO(tipoRegistro, new RecordTypeDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final RecordTypeDTO recordTypeDTO) {
        final RecordType recordType = new RecordType();
        mapToEntity(recordTypeDTO, recordType);
        return recordTypeRepository.save(recordType).getId();
    }

    public void update(final Integer id, final RecordTypeDTO recordTypeDTO) {
        final RecordType recordType = recordTypeRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(recordTypeDTO, recordType);
        recordTypeRepository.save(recordType);
    }

    public void delete(final Integer id) {
        recordTypeRepository.deleteById(id);
    }

    private RecordTypeDTO mapToDTO(final RecordType recordType,
                                   final RecordTypeDTO recordTypeDTO) {
        recordTypeDTO.setId(recordType.getId());
        recordTypeDTO.setTipoRegistro(recordType.getTipoRegistro());
        return recordTypeDTO;
    }

    private RecordType mapToEntity(final RecordTypeDTO recordTypeDTO,
                                   final RecordType recordType) {
        recordType.setTipoRegistro(recordTypeDTO.getTipoRegistro());
        return recordType;
    }

    public boolean tipoRegistroExists(final String tipoRegistro) {
        return recordTypeRepository.existsByTipoRegistroIgnoreCase(tipoRegistro);
    }

}
