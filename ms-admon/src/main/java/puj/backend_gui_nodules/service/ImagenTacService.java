package puj.backend_gui_nodules.service;

import puj.backend_gui_nodules.domain.ImagenTac;
import puj.backend_gui_nodules.model.ImagenTacDTO;
import puj.backend_gui_nodules.repos.ImagenTacRepository;
import puj.backend_gui_nodules.util.NotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class ImagenTacService {

    private final ImagenTacRepository imagenTacRepository;

    public ImagenTacService(final ImagenTacRepository imagenTacRepository) {
        this.imagenTacRepository = imagenTacRepository;
    }

    public List<ImagenTacDTO> findAll() {
        final List<ImagenTac> imagenTacs = imagenTacRepository.findAll(Sort.by("id"));
        return imagenTacs.stream()
                .map(imagenTac -> mapToDTO(imagenTac, new ImagenTacDTO()))
                .toList();
    }

    public ImagenTacDTO get(final Integer id) {
        return imagenTacRepository.findById(id)
                .map(imagenTac -> mapToDTO(imagenTac, new ImagenTacDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Integer create(final ImagenTacDTO imagenTacDTO) {
        final ImagenTac imagenTac = new ImagenTac();
        mapToEntity(imagenTacDTO, imagenTac);
        return imagenTacRepository.save(imagenTac).getId();
    }

    public void update(final Integer id, final ImagenTacDTO imagenTacDTO) {
        final ImagenTac imagenTac = imagenTacRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(imagenTacDTO, imagenTac);
        imagenTacRepository.save(imagenTac);
    }

    public void delete(final Integer id) {
        imagenTacRepository.deleteById(id);
    }

    private ImagenTacDTO mapToDTO(final ImagenTac imagenTac, final ImagenTacDTO imagenTacDTO) {
        imagenTacDTO.setId(imagenTac.getId());
        imagenTacDTO.setIdentificador(imagenTac.getIdentificador());
        return imagenTacDTO;
    }

    private ImagenTac mapToEntity(final ImagenTacDTO imagenTacDTO, final ImagenTac imagenTac) {
        imagenTac.setIdentificador(imagenTacDTO.getIdentificador());
        return imagenTac;
    }

    public boolean identificadorExists(final String identificador) {
        return imagenTacRepository.existsByIdentificadorIgnoreCase(identificador);
    }

}
