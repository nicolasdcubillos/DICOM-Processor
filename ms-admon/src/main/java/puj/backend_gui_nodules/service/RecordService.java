package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.Record;
import puj.backend_gui_nodules.domain.RecordType;
import puj.backend_gui_nodules.domain.User;
import puj.backend_gui_nodules.model.RecordCompleteDTO;
import puj.backend_gui_nodules.model.RecordDTO;
import puj.backend_gui_nodules.repos.RecordRepository;
import puj.backend_gui_nodules.repos.RecordTypeRepository;
import puj.backend_gui_nodules.repos.UserRepository;
import puj.backend_gui_nodules.util.NotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final RecordTypeRepository recordTypeRepository;

    public RecordService(final RecordRepository recordRepository,
                         final UserRepository userRepository,
                         final RecordTypeRepository recordTypeRepository) {
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.recordTypeRepository = recordTypeRepository;
    }

    public List<RecordCompleteDTO> findAll() {
        Sort sort = Sort.by(Sort.Order.asc("seen"), Sort.Order.desc("fecha"));
        final List<Record> records = recordRepository.findAll(sort);
        return records.stream()
                .map(record -> mapToCompleteDTO(record, new RecordCompleteDTO()))
                .toList();
    }

    public RecordDTO get(final Integer id) {
        return recordRepository.findById(id)
                .map(record -> mapToDTO(record, new RecordDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public RecordCompleteDTO getByUuid(final String uuid) {
        return recordRepository.findByUuid(uuid)
                .map(record -> mapToCompleteDTO(record, new RecordCompleteDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final RecordDTO recordDTO) {
        final Record record = new Record();
        mapToEntity(recordDTO, record);
        return recordRepository.save(record).getId();
    }

    public void update(final Integer id, final RecordDTO recordDTO) {
        final Record record = recordRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(recordDTO, record);
        recordRepository.save(record);
    }

    public void updateSeenStatus(final String uuid, final Boolean seen) {
        final Record record = recordRepository.findByUuid(uuid)
                .orElseThrow(NotFoundException::new);
        mapToEntityUpdateSeenStatus(record, seen);
        recordRepository.save(record);
    }

    public void updateStatus(final String uuid, final Integer tipoRegistro) {
        final Record record = recordRepository.findByUuid(uuid)
                .orElseThrow(NotFoundException::new);
        mapToEntityUpdateStatus(record, tipoRegistro);
        recordRepository.save(record);
    }

    public void delete(final Integer id) {
        recordRepository.deleteById(id);
    }

    private RecordDTO mapToDTO(final Record record, final RecordDTO recordDTO) {
        recordDTO.setId(record.getId());
        recordDTO.setFecha(record.getFecha());
        recordDTO.setUuid(record.getUuid());
        recordDTO.setNombrePaciente(record.getNombrePaciente());
        recordDTO.setNombreEstudio(record.getNombreEstudio());
        recordDTO.setSeen(record.getSeen());
        recordDTO.setImagenPrevia(record.getImagenPrevia());
        recordDTO.setUsuario(record.getUser() == null ? null : record.getUser().getId());
        recordDTO.setTipoRegistro(record.getRecordType() == null ? null : record.getRecordType().getId());
        return recordDTO;
    }

    private RecordCompleteDTO mapToCompleteDTO(final Record record, final RecordCompleteDTO recordCompleteDTO) {
        recordCompleteDTO.setId(record.getId());
        recordCompleteDTO.setFecha(record.getFecha());
        recordCompleteDTO.setUuid(record.getUuid());
        recordCompleteDTO.setNombrePaciente(record.getNombrePaciente());
        recordCompleteDTO.setNombreEstudio(record.getNombreEstudio());
        recordCompleteDTO.setSeen(record.getSeen());
        recordCompleteDTO.setImagenPrevia(record.getImagenPrevia());
        recordCompleteDTO.setUser(record.getUser() == null ? null : record.getUser());
        recordCompleteDTO.setRecordType(record.getRecordType() == null ? null : record.getRecordType());
        return recordCompleteDTO;
    }

    private Record mapToEntityUpdateStatus(final Record record, final Integer tipoRegistro) {
        final RecordType recordTypeObj = recordTypeRepository.findById(tipoRegistro)
                .orElseThrow(() -> new NotFoundException("tipoRegistro not found"));
        record.setRecordType(recordTypeObj);
        return record;
    }

    private Record mapToEntityUpdateSeenStatus(final Record record, final Boolean seen) {
        record.setSeen(seen);
        return record;
    }

    private Record mapToEntity(final RecordDTO recordDTO, final Record record) {
        ZoneId zonaHorariaColombia = ZoneId.of("America/Bogota");
        record.setFecha(LocalDateTime.now(zonaHorariaColombia));
        record.setUuid(recordDTO.getUuid());
        record.setNombrePaciente(recordDTO.getNombrePaciente());
        record.setNombreEstudio(recordDTO.getNombreEstudio());
        record.setSeen(recordDTO.getSeen());
        record.setImagenPrevia(recordDTO.getImagenPrevia());
        final User user = recordDTO.getUsuario() == null ? null : userRepository.findById(recordDTO.getUsuario())
                .orElseThrow(() -> new NotFoundException("usuario not found"));
        record.setUser(user);
        final RecordType recordType = recordDTO.getTipoRegistro() == null ? null : recordTypeRepository.findById(recordDTO.getTipoRegistro())
                .orElseThrow(() -> new NotFoundException("tipoRegistro not found"));
        record.setRecordType(recordType);
        return record;
    }

}
